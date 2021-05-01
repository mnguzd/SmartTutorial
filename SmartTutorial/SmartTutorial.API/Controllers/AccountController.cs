using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.API.Services.Interfaces;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
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
                    var token = _accountService.GenerateJwtToken(user.UserName, user.Country, user.Rating, user.FirstName, user.LastName);
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

        [HttpPost("logout")]
        public async Task<object> Logout()
        {
            await _accountService.LogOut();
            return Ok();
        }
    }
}
