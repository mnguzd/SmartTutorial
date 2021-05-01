﻿using Microsoft.AspNetCore.Identity;
using SmartTutorial.Domain.Auth;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IAccountService
    {
        Task<SignInResult> SignInAsync(string userName, string password);
        string GenerateJwtToken(string payloadUsername, string payloadCountry, int payloadRating, string payloadFirstname, string payloadLastname);
        Task<User> FindByEmail(string email);
        Task<User> FindByUserName(string username);
        public Task<IdentityResult> CreateUser(string email, string username, string password);
        public Task LogOut();
    }
}
