using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartTutorial.API.Infrastucture.Configurations;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain.Auth;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly AuthOptions _authenticationOptions;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountService(IOptions<AuthOptions> authenticationOptions, SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _authenticationOptions = authenticationOptions.Value;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<SignInResult> SignInAsync(string userName, string password)
        {
            var signInResult = await _signInManager.PasswordSignInAsync(userName, password, false, false);
            return signInResult;
        }

        public string GenerateJwtToken(string payloadUsername, string payloadCountry, int payloadRating, string payloadFirstname, string payloadLastname, string payloadEmail)
        {
            var signinCredentials = new SigningCredentials(_authenticationOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256);
            var jwtSecurityToken = new JwtSecurityToken(
                 issuer: _authenticationOptions.Issuer,
                 audience: _authenticationOptions.Audience,
                 expires: DateTime.Now.AddDays(30),
                 signingCredentials: signinCredentials
            );
            jwtSecurityToken.Payload["username"] = payloadUsername;
            jwtSecurityToken.Payload["country"] = payloadCountry;
            jwtSecurityToken.Payload["firstname"] = payloadFirstname;
            jwtSecurityToken.Payload["lastname"] = payloadLastname;
            jwtSecurityToken.Payload["rating"] = payloadRating;
            jwtSecurityToken.Payload["email"] = payloadEmail;

            var tokenHandler = new JwtSecurityTokenHandler();

            var encodedToken = tokenHandler.WriteToken(jwtSecurityToken);
            return encodedToken;
        }

        public async Task<User> FindByEmail(string email)
        {
            var userFound = await _userManager.FindByEmailAsync(email);
            return userFound;
        }

        public async Task<User> FindByUserName(string username)
        {
            var userFound = await _userManager.FindByNameAsync(username);
            return userFound;
        }

        public async Task<IdentityResult> CreateUser(string email, string username, string password)
        {
            User user = new User()
            {
                Email = email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = username
            };
            var createdResult = await _userManager.CreateAsync(user, password);
            return createdResult;
        }

        public async Task<IdentityResult> EditUserInfo(User user,string firstname,string lastname,string email,string country)
        {
            user.FirstName = firstname;
            user.LastName = lastname;
            user.Email = email;
            if (!string.IsNullOrWhiteSpace(country))
            {
                user.Country = country;
            }
            var result = await _userManager.UpdateAsync(user);
            return result;
        }


        public async Task LogOut()
        {
            await _signInManager.SignOutAsync();
        }
    }
}
