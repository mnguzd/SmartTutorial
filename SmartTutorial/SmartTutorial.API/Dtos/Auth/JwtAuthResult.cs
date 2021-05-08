using SmartTutorial.API.Dtos.Auth;
using System.Text.Json.Serialization;

namespace SmartTutorial.API.Dtos.Auth
{
    public class JwtAuthResult
    {
        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; }

        [JsonPropertyName("refreshToken")]
        public RefreshToken RefreshToken { get; set; }
    }
}
