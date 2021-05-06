using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartTutorial.API.Dtos;
using SmartTutorial.API.Dtos.JwtAuthDtos;
using SmartTutorial.API.Infrastucture.Configurations;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain.Auth;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly AuthOptions _authenticationOptions;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IWebHostEnvironment _environment;
        private readonly byte[] _secret;

        public AccountService(IOptions<AuthOptions> authenticationOptions, SignInManager<User> signInManager, UserManager<User> userManager, IWebHostEnvironment environment)
        {
            _authenticationOptions = authenticationOptions.Value;
            _signInManager = signInManager;
            _userManager = userManager;
            _environment = environment;
            _secret = Encoding.ASCII.GetBytes(_authenticationOptions.SecretKey);
        }

        public async Task<SignInResult> SignInAsync(string userName, string password)
        {
            var signInResult = await _signInManager.PasswordSignInAsync(userName, password, false, false);
            return signInResult;
        }

        private static string GenerateRefreshTokenString()
        {
            var randomNumber = new byte[32];
            using var randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public async Task RemoveRefreshTokenByUserName(string userName)
        {
            var userFound = await FindByUserName(userName);
            userFound.RefreshToken = "";
        }

        public async Task<JwtAuthResult> GenerateTokens(string username, Claim[] claims, DateTime now)
        {
            bool shouldAddAudienceClaim = string.IsNullOrWhiteSpace(claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Aud)?.Value);

            var signinCredentials = new SigningCredentials(_authenticationOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256Signature);

            var jwtToken = new JwtSecurityToken(
                 issuer: _authenticationOptions.Issuer,
                 shouldAddAudienceClaim ? _authenticationOptions.Audience : string.Empty,
                 claims,
                 expires: now.AddMinutes(_authenticationOptions.AccessTokenExpiration),
                 signingCredentials: signinCredentials
            );
            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwtToken);

            var refreshToken = new RefreshToken
            {
                UserName = username,
                TokenString = GenerateRefreshTokenString(),
                ExpireAt = now.AddMinutes(_authenticationOptions.RefreshTokenExpiration)
            };
            var userFound = await FindByUserName(username);
            if (userFound == null)
            {
                throw new SecurityTokenException("User with such username not found");
            }
            userFound.RefreshToken = refreshToken.TokenString;
            await _userManager.UpdateAsync(userFound);
            return new JwtAuthResult
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<JwtAuthResult> Refresh(string refreshToken, string accessToken, DateTime now)
        {
            var (principal, jwtToken) = DecodeJwtToken(accessToken);
            if (jwtToken == null || !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256Signature))
            {
                throw new SecurityTokenException("Invalid token");
            }
            var userName = principal.Identity?.Name;
            var userFound = await FindByUserName(userName);

            //because principal.identity.claims returns old data
            var serverName = "https://localhost:44314/UsersImages/";
            var fileName = Path.GetFileName(userFound.AvatarPath);
            var claims = new[]{
                        new Claim(ClaimTypes.Name,userFound.UserName),
                        new Claim(ClaimTypes.Email,userFound.Email),
                        new Claim(ClaimTypes.Country,userFound.Country),
                        new Claim(ClaimTypes.GivenName,userFound.FirstName),
                        new Claim(ClaimTypes.Surname,userFound.LastName),
                        new Claim("rating",userFound.Rating.ToString()),
                        new Claim("avatar",serverName+fileName)
                    };
            if (refreshToken != userFound.RefreshToken)
            {
                throw new SecurityTokenException(userFound.RefreshToken.ToString());
            }
            var result = await GenerateTokens(userFound.UserName, claims, now);
            return result;
        }

        public (ClaimsPrincipal, JwtSecurityToken) DecodeJwtToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new SecurityTokenException("Invalid token");
            }
            var principal = new JwtSecurityTokenHandler()
                .ValidateToken(token,
                    new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = _authenticationOptions.Issuer,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(_secret),
                        ValidAudience = _authenticationOptions.Audience,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromMinutes(1)
                    },
                    out var validatedToken);
            return (principal, validatedToken as JwtSecurityToken);
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

        public async Task<IdentityResult> EditUserInfo(User user, string firstname, string lastname, string email, string country)
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

        public async Task<string> UploadImage(IFormFile avatar, User user)
        {
            try
            {
                if (avatar.Length > 0)
                {
                    string path = _environment.WebRootPath + "\\UsersImages\\";
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    var defaultImage = @"C:\Users\roman\Desktop\SmartTutorial\SmartTutorial\SmartTutorial.API\wwwroot\UsersImages\Default.jpg";
                    if (File.Exists(user.AvatarPath) && user.AvatarPath != defaultImage)
                    {
                        File.Delete(user.AvatarPath);
                    }
                    var randomPath = Path.GetRandomFileName();
                    var pngPath = Path.ChangeExtension(randomPath, ".png");
                    using (FileStream fileStream = File.Create(path + pngPath))
                    {
                        await avatar.CopyToAsync(fileStream);
                        await fileStream.FlushAsync();
                        var dbPath = fileStream.Name;
                        user.AvatarPath = dbPath;
                        await _userManager.UpdateAsync(user);
                        return dbPath;
                    }
                }
                else
                {
                    return "Avatar is empty";
                }
            }
            catch
            {
                return "Internal server error";
            }
        }
        
    }
}
