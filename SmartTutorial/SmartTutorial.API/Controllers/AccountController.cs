using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.API.Services.Interfaces;
using System;
using System.IO;
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
            var signInResult = await _accountService.SignInAsync(dto.Username, dto.Password);

            if (signInResult.Succeeded)
            {
                var user = await _accountService.FindByUserName(dto.Username);
                if (user != null)
                {
                    var token = _accountService.GenerateJwtToken(user.UserName, user.Country, user.Rating, user.FirstName, user.LastName, user.Email);
                    return Ok(new { AccessToken = token });
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

        [AllowAnonymous]
        [HttpPost("uploadImage")]
        public async Task<IActionResult> UploadImage([FromForm] UploadUserAvatarDto dto)
        {
            try
            {
                if (dto.Avatar.Length > 0)
                {
                    string path = _environment.WebRootPath + "\\UsersImages\\";
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    using (FileStream fileStream = System.IO.File.Create(path + dto.Avatar.FileName))
                    {
                        await dto.Avatar.CopyToAsync(fileStream);
                        await fileStream.FlushAsync();
                        var dbPath = path + dto.Avatar.FileName;
                        return Ok(new { dbPath });
                    }
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = 500, Errors = new Error() { Message = "Internal server error" } });

            }
        }

        [HttpPost("logout")]
        public async Task<object> Logout()
        {
            await _accountService.LogOut();
            return Ok();
        }
    }
}
