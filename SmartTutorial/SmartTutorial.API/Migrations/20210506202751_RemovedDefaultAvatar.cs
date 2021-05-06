using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartTutorial.API.Migrations
{
    public partial class RemovedDefaultAvatar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "AvatarPath",
                schema: "Auth",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true,
                oldDefaultValue: "C:\\Users\\roman\\Desktop\\SmartTutorial\\SmartTutorial\\SmartTutorial.API\\wwwroot\\UsersImages\\Default.jpg");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "AvatarPath",
                schema: "Auth",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                defaultValue: "C:\\Users\\roman\\Desktop\\SmartTutorial\\SmartTutorial\\SmartTutorial.API\\wwwroot\\UsersImages\\Default.jpg",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
