using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartTutorial.API.Migrations
{
    public partial class RefreshTokenInDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                schema: "Auth",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshToken",
                schema: "Auth",
                table: "Users");
        }
    }
}
