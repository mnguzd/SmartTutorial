using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartTutorial.API.Dtos;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture.Configurations;
using SmartTutorial.Domain.Auth;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AuthOptions _authenticationOptions;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountController(IOptions<AuthOptions> authenticationOptions, SignInManager<User> signInManager,UserManager<User> userManager)
        {
            _authenticationOptions = authenticationOptions.Value;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var checkingPasswordResult = await _signInManager.PasswordSignInAsync(userForLoginDto.Username, userForLoginDto.Password, false, false);

            if (checkingPasswordResult.Succeeded)
            {
                var signinCredentials = new SigningCredentials(_authenticationOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256);
                var jwtSecurityToken = new JwtSecurityToken(
                     issuer: _authenticationOptions.Issuer,
                     audience: _authenticationOptions.Audience,
                     expires: DateTime.Now.AddDays(30),
                     signingCredentials: signinCredentials
                );
                jwtSecurityToken.Payload["username"] = userForLoginDto.Username;

                var tokenHandler = new JwtSecurityTokenHandler();

                var encodedToken = tokenHandler.WriteToken(jwtSecurityToken);

                return Ok(new { AccessToken = encodedToken });
            }
            return StatusCode(StatusCodes.Status401Unauthorized, new Response { Status = 401, Errors = new Error() { Message = "Invalid credentials! Failed to login" } });
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            var userFound = await _userManager.FindByEmailAsync(userForRegisterDto.Email);
            if (userFound != null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new Response { Status = 404, Errors = new Error() {Message = "User with this email already exists!"  }});
            }
            User user = new User()
            {
                Email = userForRegisterDto.Email,
                SecurityStamp=Guid.NewGuid().ToString(),
                UserName = userForRegisterDto.Username,
            };
            var result = await _userManager.CreateAsync(user, userForRegisterDto.Password);
            if (!result.Succeeded)
            {
                var response = new Response { Status = 404, Errors = new Error() };
                foreach(var i in result.Errors){
                    response.Errors.Message+=i.Description+" ";
                }
                return StatusCode(StatusCodes.Status404NotFound, response);
            }
            return CreatedAtAction("Register",result);
        }

        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok();
        }
    }
}
