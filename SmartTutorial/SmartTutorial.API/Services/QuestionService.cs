﻿using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SmartTutorial.API.Dtos.QuestionDtos;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using SmartTutorial.Domain.Auth;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IRepository _repository;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public QuestionService(IRepository repository, UserManager<User> userManager, IMapper mapper)
        {
            _repository = repository;
            _userManager = userManager;
            _mapper = mapper;
        }
        public async Task<QuestionDto> Add(AddQuestionWithAnswersDto dto)
        {
            var question = new Question() { Answer = dto.Answer, Text = dto.Text, TopicId = dto.TopicId };
            foreach (var answerDto in dto.Answers)
            {
                var answer = new Answer() {QuestionId = question.Id, Text = answerDto.Text };
                question.Answers.Add(answer);
            }

            await _repository.Add(question, true);
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

        public async Task<IList<QuestionDto>> GetAll()
        {
            var questions = await _repository.GetAll<Question>();
            var questionsDto = _mapper.Map<List<QuestionDto>>(questions);
            return questionsDto;
        }

        public async Task<IList<QuestionWithAnswersDto>> GetTopicQuestions(int id, string userName)
        {
            var topic = await _repository.GetById<Topic>(id);
            var questions = topic.Questions;
            var questionsDto = _mapper.Map<List<QuestionWithAnswersDto>>(questions);
            var user = await _userManager.FindByNameAsync(userName);
            foreach (var questionDto in questionsDto)
            {
                questionDto.AlreadyAnswered =
                    user.Questions.Contains(questions.FirstOrDefault(x => x.Id == questionDto.Id));
            }
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