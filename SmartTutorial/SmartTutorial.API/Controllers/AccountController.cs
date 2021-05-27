using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.Auth;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture.Models;
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
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            var signInResult = await _accountService.SignInAsync(dto.Username, dto.Password);
            return Ok(signInResult);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto dto)
        {
            var createdResult = await _accountService.CreateUser(dto);
            return Created(nameof(Register), createdResult);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("addToRole")]
        public async Task<IActionResult> AddToRole(AddToRoleDto dto)
        {
             await _accountService.AddToRole(dto);
             return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
        {
            var jwtResult = await _accountService.Refresh(dto.RefreshToken, DateTime.Now);
            return Ok(jwtResult);
        }

        [HttpPut("updateProfile")]
        public async Task<IActionResult> EditDetails(UserEditDto dto)
        {
            var editedResult = await _accountService.EditUserInfo(User.Identity.Name, dto);
            return Created(nameof(EditDetails), editedResult);
        }

        [HttpPost("uploadImage")]
        public async Task<IActionResult> UploadImage([FromForm] UploadUserAvatarDto dto)
        {
            var result = await _accountService.UploadImage(dto.Avatar, User.Identity.Name);
                return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("getPaginated")]
        public async Task<IActionResult> Get(PagedRequest request)
        {
            var usersList = await _accountService.GetPaginated(request);
            return Ok(usersList);
        }

        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout(RefreshTokenDto dto)
        {
            await _accountService.Logout(dto.RefreshToken);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _accountService.DeleteUser(id);
            return NoContent();
        }
    }
}