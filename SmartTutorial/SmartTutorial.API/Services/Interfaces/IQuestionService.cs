using System.Collections.Generic;
using System.Threading.Tasks;
using SmartTutorial.API.Dtos.QuestionDtos;
using SmartTutorial.API.Infrastucture.Models;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<QuestionTableDto> GetById(int id);
        Task<QuestionDto> Add(AddQuestionWithOptionsDto dto);
        Task<QuestionDto> Update(int id, AddQuestionWithOptionsDto dto);
        Task<bool> AnswerTheQuestion(AnswerTheQuestionDto dto, string userName);
        Task<IList<QuestionWithOptionsDto>> GetTopicQuestions(int id);
        Task<IList<QuestionWithOptionsDto>> GetTopicQuestions(int id, string userName);
        Task<PaginatedResult<QuestionTableDto>> GetPaginated(PagedRequest request);
        Task Delete(int id);
    }
}