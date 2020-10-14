using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Smart.Blazor.Demos.Data
{
	public partial class DataRecord
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public DateTime Birthday { get; set; }
		public string PetName { get; set; }
		public string Country { get; set; }
		public string ProductName { get; set; }
		public double Price { get; set; }
		public int Quantity { get; set; }
		public DateTime TimeOfPurchase { get; set; }
		public bool Expired { get; set; }
		public string Attachments { get; set; }
	}


	public partial class KanbanDataRecord
	{
		[JsonPropertyName("status")]
		public string Status
		{
			get;
			set;
		}

		[JsonPropertyName("color")]
		public string Color
		{
			get;
			set;
		}

		[JsonPropertyName("priority")]
		public string Priority
		{
			get;
			set;
		}

		[JsonPropertyName("text")]
		public string Text
		{
			get;
			set;
		}
		[JsonPropertyName("tags")]
		public string Tags
		{
			get;
			set;
		}

		[JsonPropertyName("progress")]
		public int Progress
		{
			get;
			set;
		}

		[JsonPropertyName("userId")]
		public int UserId
		{
			get;
			set;
		}

		[JsonPropertyName("id")]
		public int Id
		{
			get;
			set;
		}

		[JsonPropertyName("checkList")]
		public object[] CheckList
		{
			get;
			set;
		}

		[JsonPropertyName("comments")]
		public object[] Comments
		{
			get;
			set;
		}

		[JsonPropertyName("startDate")]
		public DateTime StartDate
		{
			get;
			set;
		}

		[JsonPropertyName("dueDate")]
		public DateTime DueDate
		{
			get;
			set;
		}

	}
	public partial class GanttDataRecord
	{
		[JsonPropertyName("label")]
		public string Label
		{
			get;
			set;
		}
		[JsonPropertyName("dateStart")]
		public string DateStart
		{
			get; set;
		}

		[JsonPropertyName("dateEnd")]
		public string DateEnd
		{
			get; set;
		}

		[JsonPropertyName("class")]
		public string Class
		{
			get; set;
		}


		[JsonPropertyName("type")]
		public string Type
		{
			get; set;
		}
	}



	public class RandomDataService
	{

		public List<KanbanDataRecord> GenerateKanbanData()
		{
			string[] text = new string[]{
				"Research", "Displaying data from data source", "Showing cover and title", "Property validation",
				"formatFunction and formatSettings", "Expand/collapse arrow", "Virtual scrolling", "Deferred scrolling",
				"Infinite scrolling", "Visible/hidden columns", "Public methods", "Editing",
				"Header", "Dragging with feedback", "Vertical virtualization", "Observable columns array",
				"Reusing existing HTML elements", "Virtualize collapsed cards"
		};

			string[] tags = new string[] { "initial", "data", "visual", "property", "scrolling", "method" };

			List<KanbanDataRecord> data = new List<KanbanDataRecord>{
			new KanbanDataRecord(){
				Id= 0,
				Status= "Done",
				Text= text[0],
				Tags= tags[0],
				Progress= 100,
				UserId= 2

			},
			new KanbanDataRecord(){
				Id= 1,
				Status= "done",
				Text= text[1],
				Tags= tags[1],
				Priority= "High",
				Progress= 100,
				UserId= 3
			},
			new KanbanDataRecord(){
				Id= 2,
				Status= "Done",
				Text= text[2],
				Tags= tags[2] + ", " + tags[3],
				Priority= "High",
				Progress= 100,
				UserId= 2
			},
			new KanbanDataRecord(){
				Id= 3,
				Status= "Done",
				Text= text[3],
				Tags= tags[3],
				CheckList= new object[]
				{
					new { Text= "addNewButton", Completed= true },
					new { Text= "allowDrag", Completed= true },
					new { Text= "cardHeight", Completed= true },
					new { Text= "cellOrientation", Completed= true },
					new { Text= "collapsible", Completed= true },
					new { Text= "columns", Completed= true }
				},
				UserId= 1
			},
			new KanbanDataRecord(){
				Id= 4,
				Status= "Done",
				Text= text[4],
				Tags= tags[1] + ", " + tags[3],
				Progress= 100,
				UserId= 0
			},
			new KanbanDataRecord(){
				 Id= 5,
				Status= "Testing",
				Text= text[5],
				Tags= tags[2],
				Progress= 90,
				UserId= 3
			},
			new KanbanDataRecord(){
				Id= 7,
				Status= "Testing",
				Text= text[6],
				Tags= tags[4] + ", " + tags[1],
				Progress= 10,
				UserId= 3
			},
			new KanbanDataRecord(){
				Id= 6,
				Status= "Testing",
				Text= text[7],
				Tags= tags[4],
				Color= "#9966CC",
				UserId= 3
			},
			new KanbanDataRecord(){
				Id= 8,
				Status= "InProgress",
				Text= text[8],
				Tags= tags[4] + ", " + tags[1],
				Progress= 25,
				UserId= 0
			},
			new KanbanDataRecord(){
				Id= 9,
				Status= "InProgress",
				Text= text[9],
				Tags= tags[2],
				Priority= "High",
				Progress= 85,
				Color= "red",
				UserId= 1
			},
			new KanbanDataRecord(){
				Id= 10,
				Status= "InProgress",
				Text= text[10],
				Tags= tags[5],
				CheckList= new object[]
				{
					new { Text= "closePanel", Completed= true },
					new { Text= "openCustomizePanel", Completed= true },
					new { Text= "openFilterPanel", Completed= true },
					new { Text= "openSortPanel", Completed= false },
					new { Text= "showColumn", Completed= false },
					new { Text= "hideColumn", Completed= false },
					new { Text= "addFilter", Completed= false },
					new { Text= "removeFilter", Completed= false }
				},
				UserId= 2
			},
			new KanbanDataRecord(){
				Id= 11,
				Status= "ToDo",
				Text= text[11],
				Tags= tags[5],
				Priority= "High",
				Progress= 0
			},
			new KanbanDataRecord(){
				Id= 12,
				Status= "ToDo",
				Text= text[12],
				Tags= tags[2]
			},
			new KanbanDataRecord(){
				Id= 13,
				Status= "ToDo",
				Text= text[13],
				Tags= tags[2] + ", " + tags[5] + ", " + tags[1],
				Priority= "low",
				UserId= 4
			},
			new KanbanDataRecord(){
				Id= 14,
				Status= "ToDo",
				Text= text[14],
				CheckList= new object[] {
					new { Text= text[16], Completed= false },
					new { Text= text[17], Completed= false }
				},
				UserId= 1
			},
			new KanbanDataRecord(){
				Id= 15,
				Status= "ToDo",
				Text= text[15],
				Tags= tags[1]
			}
		};

			string[] comments = new string[]{
				"Ut ultrices dolor vitae magna lacinia vehicula.",
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				"Donec vitae dapibus mauris, quis cursus nibh.",
				"Aenean ultrices maximus ex id scelerisque. Suspendisse cursus maximus nulla, sed ornare lectus aliquet eu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
				"Curabitur at accumsan metus, rhoncus porttitor ligula.",
				"Nulla sodales faucibus accumsan."
			};

			for (int i = 0; i < data.Count; i++)
			{
				KanbanDataRecord task = data[i];

				DateTime startDate = new DateTime(2020, 1 + new Random().Next(10), 1 + new Random().Next(25));

				task.StartDate = startDate;


				if (task.Priority == "High" && task.Status != "Done")
				{
					task.DueDate = new DateTime(2020, startDate.Month, task.StartDate.Day + 1);
				}
				else if (task.Priority == "Low")
				{
					task.DueDate = new DateTime(2020, startDate.Month, task.StartDate.Day + 1);
				}
				else
				{
					task.DueDate = new DateTime(2020, startDate.Month, task.StartDate.Day + 1);
				}


				int numberOfComments = new Random().Next(3);

				task.Comments = new object[] { };
				List<object> taskComments = new List<object>();

				for (int j = 0; j < numberOfComments; j++)
				{
					taskComments.Add(new
					{
						text = comments[new Random().Next(5)],
						userId = new Random().Next(4),
						time = new DateTime()
					});

					task.Comments = taskComments.ToArray();
				}
			}

			return data;
		}

		public List<DataRecord> GenerateData(int length)
		{
			List<DataRecord> sampleData = new List<DataRecord>();
			string[] firstNames = new string[] { "Andrew", "Nancy", "Shelley", "Regina", "Yoshi", "Antoni", "Mayumi", "Ian", "Peter", "Lars", "Petra", "Martin", "Sven", "Elio", "Beate", "Cheryl", "Michael", "Guylene" };
			string[] lastNames = new string[] { "Fuller", "Davolio", "Burke", "Murphy", "Nagase", "Saavedra", "Ohno", "Devling", "Wilson", "Peterson", "Winkler", "Bein", "Petersen", "Rossi", "Vileid", "Saylor", "Bjorn", "Nodier" };
			string[] petNames = new string[] { "Sam", "Bob", "Lucky", "Tommy", "Charlie", "Olliver", "Mixie", "Fluffy", "Acorn", "Beak" };
			string[] countries = new string[] { "Bulgaria", "USA", "UK", "Singapore", "Thailand", "Russia", "China", "Belize" };
			string[] productNames = new string[] { "Black Tea", "Green Tea", "Caffe Espresso", "Doubleshot Espresso", "Caffe Latte", "White Chocolate Mocha", "Cramel Latte", "Caffe Americano", "Cappuccino", "Espresso Truffle", "Espresso con Panna", "Peppermint Mocha Twist" };

			for (int i = 0; i < length; i++)
			{
				DataRecord data = new DataRecord()
				{
					FirstName = firstNames[new Random().Next(firstNames.Length - 1)],
					LastName = lastNames[new Random().Next(lastNames.Length - 1)],
					Birthday = new DateTime(2020, 1 + new Random().Next(10), 1 + new Random().Next(28)),
					PetName = petNames[new Random().Next(petNames.Length - 1)],
					ProductName = productNames[new Random().Next(productNames.Length - 1)],
					Country = countries[new Random().Next(countries.Length - 1)],
					Price = new Random().NextDouble() * 100 + 1,
					Quantity = new Random().Next(100) + 1,
					TimeOfPurchase = new DateTime(2020, 1 + new Random().Next(10), 1 + new Random().Next(28)),
					Expired = new Random().NextDouble() > 0.5,
					Attachments = ""
				};

				int maxAttachments = new Random().Next(3) + 1;
				for (int j = 0; j < maxAttachments; j++)
				{
					data.Attachments += "https://www.htmlelements.com/demos//images/travel/" + new Random().Next(30).ToString() + ".jpg";

					if (j < maxAttachments - 1)
					{
						data.Attachments += ", ";
					}
				}

				sampleData.Add(data);
			}

			return sampleData;
		}

		public List<GanttDataRecord> GenerateGanttData()
		{
			List<GanttDataRecord> records = new List<GanttDataRecord>()
			{
				new GanttDataRecord() {
					Label= "PRD & User-Stories",
					DateStart= "2021-01-10",
					DateEnd= "2021-03-10",
					Class= "product-team",
					Type= "task"
				},
				new GanttDataRecord() {
					Label= "Persona & Journey",
					DateStart= "2021-03-01",
					DateEnd= "2021-04-30",
					Class= "marketing-team",
					Type= "task"
				},
				new GanttDataRecord() {
					Label= "Architecture",
					DateStart= "2021-04-11",
					DateEnd= "2021-05-16",
					Class= "product-team",
					Type= "task"
				},
				new GanttDataRecord() {
					Label= "Prototyping",
					DateStart= "2021-05-17",
					DateEnd= "2021-07-01",
					Class= "dev-team",
					Type= "task"
				},
				new GanttDataRecord() {
					Label= "Design",
					DateStart= "2021-07-02",
					DateEnd= "2021-08-01",
					Class= "design-team",
					Type= "task"
				},
				new GanttDataRecord() {
					Label= "Development",
					DateStart= "2021-08-01",
					DateEnd= "2021-09-10",
					Class= "dev-team",
					Type= "task"
				},
				new GanttDataRecord() {
					Label= "Testing & QA",
					DateStart= "2021-09-11",
					DateEnd= "2021-10-10",
					Class= "qa-team",
					Type= "task"
				},
				new GanttDataRecord() {
					Label= "UAT Test",
					DateStart= "2021-10-12",
					DateEnd= "2021-11-11",
					Class= "product-team",
					Type= "task"
				},
				new GanttDataRecord() {
					Label= "Handover & Documentation",
					DateStart= "2021-10-17",
					DateEnd= "2021-11-31",
					Class= "marketing-team",
					Type= "task"
				},
				new GanttDataRecord() {
					Label= "Release",
					DateStart= "2021-11-01",
					DateEnd= "2021-12-31",
					Class= "release-team",
					Type= "task"
				}
			};

			return records;
		}

		public Task<DataRecord[]> GetDataAsync(int length)
		{
			List<DataRecord> records = GenerateData(length);

			return Task.FromResult(records.ToArray());
		}

		public Task<GanttDataRecord[]> GetGanttDataAsync()
		{
			List<GanttDataRecord> records = GenerateGanttData();

			return Task.FromResult(records.ToArray());
		}

		public Task<KanbanDataRecord[]> GetKanbanDataAsync()
		{
			List<KanbanDataRecord> records = GenerateKanbanData();

			return Task.FromResult(records.ToArray());
		}
	}
}
