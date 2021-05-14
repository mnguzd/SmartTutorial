using AutoMapper;
using SmartTutorial.API.Dtos.ThemeDtos;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Implementations
{
    public class ThemeService : IThemeService
    {
        private readonly IMapper _mapper;
        private readonly IRepository _repository;

        public ThemeService(IRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IList<ThemeDto>> GetAll()
        {
            var subjects = await _repository.GetAll<Theme>();
            var subjectsDto = _mapper.Map<List<ThemeDto>>(subjects);
            return subjectsDto;
        }

        public async Task<PaginatedResult<ThemeDto>> GetPaginated(PagedRequest request)
        {
            var result = await _repository.GetPagedData<Theme, ThemeDto>(request);
            return result;
        }

        public async Task<ThemeDto> GetWithInclude(int id)
        {
            var theme = await _repository.GetByIdWithInclude<Theme>(id, x => x.Subjects);
            var themeDto = _mapper.Map<ThemeDto>(theme);
            return themeDto;
        }
    }
}