using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.QuestionDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Services.Interfaces;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExceptionFilter]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionsController(IQuestionService service)
        {
            _questionService = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("getPaginated")]
        public async Task<IActionResult> Post(PagedRequest request)
        {
            var questionList = await _questionService.GetPaginated(request);
            return Ok(questionList);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] AddQuestionWithOptionsDto dto)
        {
            await _questionService.Update(id, dto);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var question = await _questionService.GetById(id);
            return Ok(question);
        }

        [HttpGet("byTopicId/{topicId:int}")]
        public async Task<IActionResult> GetByTopicId(int topicId)
        {
            var questions = await _questionService.GetTopicQuestions(topicId, User?.Identity.Name);
            return Ok(questions);
        }

        [AllowAnonymous]
        [HttpGet("guest/byTopicId/{topicId:int}")]
        public async Task<IActionResult> GetByTopicIdGuest(int topicId)
        {
            var questions = await _questionService.GetTopicQuestions(topicId);
            return Ok(questions);
        }

        [HttpPost("answer")]
        public async Task<IActionResult> AnswerTheQuestion(AnswerTheQuestionDto dto)
        {
            var result = await _questionService.AnswerTheQuestion(dto, User?.Identity.Name);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddQuestionWithOptionsDto dto)
        {
            var question = await _questionService.Add(dto);
            return Created(nameof(Post), question);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _questionService.Delete(id);
            return NoContent();
        }
    }
}