using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SmartTutorial.API.Dtos.QuestionDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using SmartTutorial.Domain.Auth;

namespace SmartTutorial.API.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IMapper _mapper;
        private readonly IRepository _repository;
        private readonly UserManager<User> _userManager;

        public QuestionService(IRepository repository, UserManager<User> userManager, IMapper mapper)
        {
            _repository = repository;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<QuestionDto> Add(AddQuestionWithOptionsDto dto)
        {
            var question = new Question {Answer = dto.Answer, Text = dto.Text, TopicId = dto.TopicId};
            var answers = new List<Option>
            {
                new Option {QuestionId = question.Id, Text = dto.Option1},
                new Option {QuestionId = question.Id, Text = dto.Option2},
                new Option {QuestionId = question.Id, Text = dto.Option3},
                new Option {QuestionId = question.Id, Text = dto.Option4}
            };

            question.Options.AddRange(answers);

            await _repository.Add(question, true);
            var questionDto = _mapper.Map<QuestionDto>(question);
            return questionDto;
        }

        public async Task<QuestionDto> Update(int id, AddQuestionWithOptionsDto dto)
        {
            var question = await _repository.GetById<Question>(id);
            if (question == null)
            {
                throw new ApiException(HttpStatusCode.NotFound, "Question not found");
            }

            question.Answer = dto.Answer;
            question.Text = dto.Text;
            question.TopicId = dto.TopicId;
            question.Options[0].Text = dto.Option1;
            question.Options[1].Text = dto.Option2;
            question.Options[2].Text = dto.Option3;
            question.Options[3].Text = dto.Option4;
            await _repository.SaveAll();
            var questionDto = _mapper.Map<QuestionDto>(question);
            return questionDto;
        }

        public async Task<bool> AnswerTheQuestion(AnswerTheQuestionDto dto, string userName)
        {
            var question = await _repository.GetById<Question>(dto.Id);
            var user = await _userManager.FindByNameAsync(userName);
            var result = dto.UserAnswer == question.Answer;
            if (question.Users.Contains(user))
            {
                return result;
            }

            question.Users.Add(user);
            if (result)
            {
                user.Rating++;
            }

            await _repository.SaveAll();
            return result;
        }

        public async Task Delete(int id)
        {
            await _repository.Delete<Question>(id);
            await _repository.SaveAll();
        }

        public async Task<IList<QuestionWithOptionsDto>> GetTopicQuestions(int id, string userName)
        {
            var topic = await _repository.GetById<Topic>(id);
            var questions = topic.Questions;
            var questionsDto = _mapper.Map<List<QuestionWithOptionsDto>>(questions);
            var user = await _userManager.FindByNameAsync(userName);
            foreach (var questionDto in questionsDto)
            {
                questionDto.AlreadyAnswered =
                    user.Questions.Contains(questions.FirstOrDefault(x => x.Id == questionDto.Id));
            }

            return questionsDto;
        }

        public async Task<IList<QuestionWithOptionsDto>> GetTopicQuestions(int id)
        {
            var topic = await _repository.GetById<Topic>(id);
            var questions = topic.Questions;
            var questionsDto = _mapper.Map<List<QuestionWithOptionsDto>>(questions);
            return questionsDto;
        }

        public async Task<QuestionTableDto> GetById(int id)
        {
            var question = await _repository.GetById<Question>(id);
            var questionDto = _mapper.Map<QuestionTableDto>(question);
            return questionDto;
        }

        public async Task<PaginatedResult<QuestionTableDto>> GetPaginated(PagedRequest request)
        {
            var result = await _repository.GetPagedData<Question, QuestionTableDto>(request);
            return result;
        }
    }
}