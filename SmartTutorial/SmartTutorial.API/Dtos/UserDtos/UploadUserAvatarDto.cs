using Microsoft.AspNetCore.Http;
using SmartTutorial.API.Infrastucture.Attributes;
using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.UserDtos
{
    public class UploadUserAvatarDto
    {
        [Required]
        [DataType(DataType.Upload)]
        [MaxFileSize(2 * 1024 * 1024)]
        [AllowedExtensions(new string[] { ".jpg", ".png",".jpeg" })]
        public IFormFile Avatar { get; set; }

        [Required]
        [StringLength(20)]
        [MinLength(4)]
        public string Username { get; set; }
    }
}
