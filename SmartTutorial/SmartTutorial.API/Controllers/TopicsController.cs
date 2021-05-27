using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.TopicDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Services.Interfaces;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExceptionFilter]
    public class TopicsController : ControllerBase
    {
        private readonly ITopicService _topicService;

        public TopicsController(ITopicService topicService)
        {
            _topicService = topicService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("lightTopics")]
        public async Task<IActionResult> GetLightTopics()
        {
            var topicList = await _topicService.GetLightTopics();
            return Ok(topicList);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("getPaginated")]
        public async Task<IActionResult> Post(PagedRequest request)
        {
            var topicList = await _topicService.GetPaginated(request);
            return Ok(topicList);
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var topic = await _topicService.GetById(id);
            return Ok(topic);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddTopicDto dto)
        {
            var topic = await _topicService.Add(dto);
            return Created(nameof(Post), topic);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _topicService.Delete(id);
            return NoContent();
        }
    }
}
