﻿using SmartTutorial.API.Dtos.QuestionDtos;
using SmartTutorial.API.Infrastucture.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<QuestionTableDto> GetById(int id);
        Task<IList<QuestionDto>> GetAll();
        Task<QuestionDto> Add(AddQuestionWithAnswersDto dto);
        Task<QuestionWithAnswersDto> GetWithAnswers(int id);
        Task<QuestionDto> Update(int id, AddQuestionWithAnswersDto dto);
        Task<bool> AnswerTheQuestion(AnswerTheQuestionDto dto, string userName);
        Task<IList<QuestionWithAnswersDto>> GetTopicQuestions(int id);
        Task<IList<QuestionWithAnswersDto>> GetTopicQuestions(int id, string userName);
        Task<PaginatedResult<QuestionTableDto>> GetPaginated(PagedRequest request);
        Task Delete(int id);
    }
}
