using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.UserDtos
{
    public class UserForRegisterDto
    {
        [Required]
        [StringLength(20)]
        [MinLength(4)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(80)]
        [MinLength(8)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [MaxLength(80)]
        [MinLength(8)]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords does`n match!")]
        public string ConfirmPassword { get; set; }
    }
}
