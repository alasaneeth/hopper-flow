using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HopperFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPreparationAndDoughTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RiceUsedKg",
                table: "ProductionBatches");

            migrationBuilder.RenameColumn(
                name: "WastageKg",
                table: "ProductionBatches",
                newName: "DoughUsedKg");

            migrationBuilder.CreateTable(
                name: "DoughStocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductType = table.Column<int>(type: "int", nullable: false),
                    QuantityKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LowStockThresholdKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoughStocks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PreparationBatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductType = table.Column<int>(type: "int", nullable: false),
                    RiceUsedKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MillingDone = table.Column<bool>(type: "bit", nullable: false),
                    SievingDone = table.Column<bool>(type: "bit", nullable: false),
                    DoughProducedKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PreparationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreparationBatches", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoughStocks");

            migrationBuilder.DropTable(
                name: "PreparationBatches");

            migrationBuilder.RenameColumn(
                name: "DoughUsedKg",
                table: "ProductionBatches",
                newName: "WastageKg");

            migrationBuilder.AddColumn<decimal>(
                name: "RiceUsedKg",
                table: "ProductionBatches",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
