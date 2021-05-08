using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos;
using SmartTutorial.API.Dtos.Auth;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.API.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IWebHostEnvironment _environment;

        public AccountController(IAccountService accountService, IWebHostEnvironment environment)
        {
            _accountService = accountService;
            _environment = environment;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { Status = 400, Errors = new Error() { Message = "Server error. Try again or use another credentials" } });
            }
            var signInResult = await _accountService.SignInAsync(dto.Username, dto.Password);

            if (signInResult.Succeeded)
            {
                var user = await _accountService.FindByUserName(dto.Username);
                if (user != null)
                {
                    var claims = _accountService.GenerateClaims(user);
                    var jwtResult = await _accountService.GenerateTokens(user.UserName, claims, DateTime.Now);
                    return Ok(jwtResult);
                }
                else
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new Response { Status = 401, Errors = new Error() { Message = "Server error. Try again or use another credentials" } });
                }
            }
            return StatusCode(StatusCodes.Status401Unauthorized, new Response { Status = 401, Errors = new Error() { Message = "Invalid credentials! Failed to login" } });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto dto)
        {
            var userFound = await _accountService.FindByEmail(dto.Email);
            if (userFound != null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new Response { Status = 404, Errors = new Error() { Message = "User with this email already exists!" } });
            }
            var createdResult = await _accountService.CreateUser(dto);
            if (!createdResult.Succeeded)
            {
                var response = new Response { Status = 404, Errors = new Error() };
                foreach (var i in createdResult.Errors)
                {
                    response.Errors.Message += i.Description + " ";
                }
                return StatusCode(StatusCodes.Status404NotFound, response);
            }
            return CreatedAtAction("Register", createdResult);
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.RefreshToken))
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new Response { Status = 401, Errors = new Error() { Message = "Empty refresh token is not allowed" } });
                }
                var jwtResult = await _accountService.Refresh(dto.RefreshToken, DateTime.Now);
                return Ok(jwtResult);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new Response { Status = 401, Errors = new Error() { Message = ex.Message } });
            }
        }

        [HttpPatch("patch")]
        public async Task<IActionResult> EditDetails(UserEditDto dto)
        {
            var userFound = await _accountService.FindByUserName(User.Identity.Name);
            var theSameUser = await _accountService.FindByEmail(dto.Email);
            if (theSameUser != null &&userFound.Email!=theSameUser.Email)
            {
                return StatusCode(StatusCodes.Status406NotAcceptable, new Response { Status = 406, Errors = new Error() { Message = "User with this email already exists!" } });
            }
            if (userFound != null)
            {
                var editedResult = await _accountService.EditUserInfo(userFound, dto);
                if (editedResult.Succeeded)
                {
                    return CreatedAtAction(nameof(EditDetails), dto);
                }
                return StatusCode(StatusCodes.Status406NotAcceptable, new Response { Status = 406, Errors = new Error() { Message = "Error, try using another credentials" } });
            }
            return StatusCode(StatusCodes.Status406NotAcceptable, new Response { Status = 406, Errors = new Error() { Message = "Error, try using another credentials" } });
        }

        [HttpPost("uploadImage")]
        public async Task<IActionResult> UploadImage([FromForm] UploadUserAvatarDto dto)
        {
            var userFound = await _accountService.FindByUserName(User.Identity.Name);
            if (userFound == null)
            {
                return NotFound();
            }
            var result = await _accountService.UploadImage(dto.Avatar, userFound);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout(RefreshTokenDto dto)
        {
            await _accountService.Logout(dto.RefreshToken);
            return Ok();
        }
    }
}
