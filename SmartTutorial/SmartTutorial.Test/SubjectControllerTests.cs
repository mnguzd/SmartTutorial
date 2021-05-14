using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using SmartTutorial.API;
using SmartTutorial.API.Controllers;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Dtos.ThemeDtos;
using SmartTutorial.API.Mapping;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace SmartTutorial.Test
{
    public class SubjectControllerTests : IClassFixture<TestFixture<Startup>>
    {
        private readonly SubjectsController _controller;
        private readonly Mock<ISubjectService> _service = new Mock<ISubjectService>();
        private readonly HttpClient _client;

        public SubjectControllerTests(TestFixture<Startup> fixture)
        {
            _client = fixture.Client;

            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            IMapper mapper = new Mapper(configuration);

            _controller = new SubjectsController(_service.Object);
        }
        [Fact]
        public async Task GetReturnsOkResult()
        {
            //Arrange

            //Act
            var data = await _controller.Get();

            //Assert
            Assert.IsType<OkObjectResult>(data);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(3)]
        [InlineData(302)]
        public async Task GetByIdReturnsOkResult(int subjectId)
        {
            //Arrange
            _service.Setup(x => x.GetById<Subject>(subjectId)).ReturnsAsync(new Subject() { Name = "fewfwe", Complexity = 2, ThemeId = 2 });

            //Act
            var data = await _controller.Get(subjectId);

            //Assert
            Assert.IsType<OkObjectResult>(data);
        }

        [Fact]
        public async Task GetByIdReturnsNotFount()
        {
            //Arrange
            int subjectId = 320;
            Subject subject = null;
            _service.Setup(x => x.GetById(subjectId)).ReturnsAsync(subject);

            //Act
            var data = await _controller.Get(subjectId);

            //Assert
            Assert.IsType<NotFoundResult>(data);
        }

        [Fact]
        public async Task PostReturnsCreatedAtAction()
        {
            //Arrange
            AddSubjectDto dto = new AddSubjectDto() { Name = "Fejlfwe", Complexity = 3, ThemeId = 1 };
            _service.Setup(x => x.Add(It.IsAny<AddSubjectDto>())).ReturnsAsync(new Subject() { Name = "Fejlfwe", Complexity = 3, ThemeId = 1 });

            //Act
            var data = await _controller.Post(dto);

            //Assert
            Assert.IsType<CreatedAtActionResult>(data);
        }
        [Fact]
        public async Task PutReturnsNoContent()
        {
            //Arrange
            UpdateSubjectDto dto = new UpdateSubjectDto() { Complexity = 2, Name = "dfew" };
            _service.Setup(x => x.Update(2, It.IsAny<UpdateSubjectDto>())).ReturnsAsync(new Subject() { Complexity = 2, Name = "dfew", ThemeId = 1 });

            //Act
            var data = await _controller.Put(2, dto);

            //Assert
            Assert.IsType<NoContentResult>(data);
        }
        [Fact]
        public async Task PutReturnsNotFound()
        {
            //Arrange
            UpdateSubjectDto dto = new UpdateSubjectDto() { Complexity = 2, Name = "dfew" };
            Subject subject = null;
            _service.Setup(x => x.Update(2, It.IsAny<UpdateSubjectDto>())).ReturnsAsync(subject);

            //Act
            var data = await _controller.Put(2, dto);

            //Assert
            Assert.IsType<NotFoundResult>(data);
        }

        [Theory]
        [InlineData("Subjects")]
        [InlineData("Themes")]
        public async Task ShouldAccess_GetEndPonts(string endPoint)
        {
            var request = "/api/" + endPoint;
            var response = await _client.GetAsync(request);
            response.EnsureSuccessStatusCode();
        }

        [Theory]
        [InlineData(1)]
        [InlineData(4)]
        [InlineData(6)]
        public async Task ShouldGetSubjectById(int subjectId)
        {
            var request = $"/api/Subjects/{subjectId}";
            var response = await _client.GetAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var obj = JsonConvert.DeserializeObject<SubjectDto>(json);
                Assert.True(obj.Id == subjectId);
            }
            response.EnsureSuccessStatusCode();
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public async Task SouldReturnThemeWithSubjectsById(int themeId)
        {
            var request = $"/api/Themes/{themeId}";
            var response = await _client.GetAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var obj = JsonConvert.DeserializeObject<ThemeWithSubjectsDto>(json);
                Assert.NotNull(obj.Subjects);
            }
            response.EnsureSuccessStatusCode();
        }
    }
}
