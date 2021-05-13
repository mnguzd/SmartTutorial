using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.Auth;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Services.Interfaces;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExceptionFilter]
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
            return Ok(signInResult);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto dto)
        {
            var createdResult = await _accountService.CreateUser(dto);
            return Created(nameof(Register), createdResult);
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
        {
            var jwtResult = await _accountService.Refresh(dto.RefreshToken, DateTime.Now);
            return Ok(jwtResult);
        }

        [HttpPatch("patch")]
        public async Task<IActionResult> EditDetails(UserEditDto dto)
        {
            var editedResult = await _accountService.EditUserInfo(User.Identity.Name, dto);
            return Created(nameof(EditDetails), editedResult);
        }

        [HttpPost("uploadImage")]
        public async Task<IActionResult> UploadImage([FromForm] UploadUserAvatarDto dto)
        {
            try
            {
                var result = await _accountService.UploadImage(dto.Avatar, User.Identity.Name);
                return Ok(result);
            }
            catch
            {
                return StatusCode(500);
            }
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