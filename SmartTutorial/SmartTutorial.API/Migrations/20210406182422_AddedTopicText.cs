using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartTutorial.API.Migrations
{
    public partial class AddedTopicText : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "Topics",
                type: "nvarchar(max)",
                maxLength: 10000,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Text",
                table: "Topics");
        }
    }
}
