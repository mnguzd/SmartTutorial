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

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var topicList = await _topicService.GetAll();
            return Ok(topicList);
        }

        [AllowAnonymous]
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

        [AllowAnonymous]
        [HttpGet("withQuestions/{id:int}")]
        public async Task<IActionResult> GetWithQuestions(int id)
        {
            var topic = await _topicService.GetWithQuestions(id);
            return Ok(topic);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddTopicDto dto)
        {
            var topic = await _topicService.Add(dto);
            return Created(nameof(Post), topic);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _topicService.Delete(id);
            return NoContent();
        }
    }
}
