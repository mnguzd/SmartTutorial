using SmartTutorial.API.Dtos.QuestionDtos;
using SmartTutorial.API.Infrastucture.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<QuestionDto> GetById(int id);
        Task<IList<QuestionDto>> GetAll();
        Task<QuestionDto> Add(AddQuestionWithAnswersDto dto);
        Task<QuestionWithAnswersDto> GetWithAnswers(int id);
        Task<bool> AnswerTheQuestion(AnswerTheQuestionDto dto, string userName);
        Task<IList<QuestionWithAnswersDto>> GetTopicQuestions(int id, string userName);
        Task<PaginatedResult<QuestionDto>> GetPaginated(PagedRequest request);
        Task Delete(int id);
    }
}
