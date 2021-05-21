using AutoMapper;
using SmartTutorial.API.Dtos.QuestionDtos;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IRepository _repository;
        private readonly IMapper _mapper;

        public QuestionService(IRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<QuestionDto> Add(AddQuestionWithAnswersDto dto)
        {
            var question = new Question() { Answer = dto.Answer, Text = dto.Text, TopicId = dto.TopicId };
            foreach (var answerDto in dto.Answers)
            {
                var answer = new Answer() { IsTrue = answerDto.IsTrue, QuestionId = question.Id, Text = answerDto.Text };
                question.Answers.Add(answer);
            }

            await _repository.Add(question, true);
            var questionDto = _mapper.Map<QuestionDto>(question);
            return questionDto;
        }

        public async Task Delete(int id)
        {
            await _repository.Delete<Question>(id);
            await _repository.SaveAll();
        }

        public async Task<IList<QuestionDto>> GetAll()
        {
            var questions = await _repository.GetAll<Question>();
            var questionsDto = _mapper.Map<List<QuestionDto>>(questions);
            return questionsDto;
        }

        public async Task<IList<QuestionWithAnswersDto>> GetTopicQuestions(int id)
        {
            var topic = await _repository.GetById<Topic>(id);
            var questions = topic.Questions;
            var questionsDto = _mapper.Map<List<QuestionWithAnswersDto>>(questions);
            return questionsDto;
        }

        public async Task<QuestionDto> GetById(int id)
        {
            var question = await _repository.GetById<Question>(id);
            var questionDto = _mapper.Map<QuestionDto>(question);
            return questionDto;
        }

        public async Task<PaginatedResult<QuestionDto>> GetPaginated(PagedRequest request)
        {
            var result = await _repository.GetPagedData<Question, QuestionDto>(request);
            return result;
        }

        public async Task<QuestionWithAnswersDto> GetWithAnswers(int id)
        {
            var question = await _repository.GetByIdWithInclude<Question>(id, x => x.Answers);
            var questionDto = _mapper.Map<QuestionWithAnswersDto>(question);
            return questionDto;
        }
    }
}
