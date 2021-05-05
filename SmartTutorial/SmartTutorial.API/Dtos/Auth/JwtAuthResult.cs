using SmartTutorial.API.Dtos.JwtAuthDtos;
using System.Text.Json.Serialization;

namespace SmartTutorial.API.Dtos
{
    public class JwtAuthResult
    {
        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; }

        [JsonPropertyName("refreshToken")]
        public RefreshToken RefreshToken { get; set; }
    }
}
