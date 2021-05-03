using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.UserDtos
{
    public class UploadUserAvatarDto
    {
        [Required]
        public IFormFile Avatar { get; set; }
    }
}
