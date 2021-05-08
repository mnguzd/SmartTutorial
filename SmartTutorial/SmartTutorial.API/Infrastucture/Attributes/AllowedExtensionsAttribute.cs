using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;

namespace SmartTutorial.API.Infrastucture.Attributes
{
    public class AllowedExtensionsAttribute : ValidationAttribute
    {
        private readonly string[] _extensions;
        public AllowedExtensionsAttribute(string[] extensions)
        {
            _extensions = extensions;
        }

        protected override ValidationResult IsValid(
        object value, ValidationContext validationContext)
        {
            if (!(value is IFormFile file))
            {
                return ValidationResult.Success;
            }
            var extension = Path.GetExtension(file.FileName);
            if (extension != null && !_extensions.Contains(extension.ToLower()))
            {
                return new ValidationResult(GetErrorMessage());
            }

            return ValidationResult.Success;
        }

        private string GetErrorMessage()
        {
            var result = "Only ";
            foreach (var s in _extensions)
            {
                result += s + " ";
            }
            result += "file extensions are allowed";
            return result;
        }
    }
}
