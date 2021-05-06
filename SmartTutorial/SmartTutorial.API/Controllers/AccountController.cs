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
using System.IO;
using System.Security.Claims;
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
                    var serverName = "https://localhost:44314/UsersImages/";
                    var fileName = Path.GetFileName(user.AvatarPath);
                    var claims = new[]{
                        new Claim(ClaimTypes.Name,user.UserName),
                        new Claim(ClaimTypes.Email,user.Email),
                        new Claim(ClaimTypes.Country,user.Country),
                        new Claim(ClaimTypes.GivenName,user.FirstName),
                        new Claim(ClaimTypes.Surname,user.LastName),
                        new Claim("rating",user.Rating.ToString()),
                        new Claim("avatar",serverName+fileName)
                    };
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
            var createdResult = await _accountService.CreateUser(dto.Email, dto.Username, dto.Password);
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

        
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.RefreshToken))
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new Response { Status = 401, Errors = new Error() { Message = "Empty refresh token is not allowed" } });
                }
                var accessToken = await HttpContext.GetTokenAsync("Bearer", "access_token");
                var jwtResult = await _accountService.Refresh(dto.RefreshToken, accessToken, DateTime.Now);
                return Ok(jwtResult);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new Response { Status = 401, Errors = new Error() { Message = ex.Message } });
            }
        }

        [HttpPatch("patch")]
        public async Task<IActionResult> EditDetails(UserEditDto dto)
        {
            var userFound = await _accountService.FindByUserName(dto.Username);
            if (userFound != null)
            {
                var editedResult = await _accountService.EditUserInfo(userFound, dto.Firstname, dto.Lastname, dto.Email, dto.Country);
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

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var userName = User.Identity.Name;
            _accountService.RemoveRefreshTokenByUserName(userName);
            return Ok();
        }
    }
}
