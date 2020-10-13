Smart.Blazor Component Library
==============================

Smart Blazor Components is a commercial set of 60+ Blazor UI controls. Both server-side and client-side.

Getting Started
---------------

###   

### Installation

Smart.Blazor Components are distributed as the **Smart.Blazor** Nuget package. You can use any of the following options:

*   Install the package from command line by running **dotnet add package Smart.Blazor**.
*   Alternatively, you can add the project from the Visual Nuget Package Manager.
*   Edit the .csproj file and add a project reference

### Import the Smart.Blazor namespace.

Open the \_Imports.razor file of your Blazor application and add `@using Smart.Blazor`

### Set a Theme

Open the \_Host.cshtml file (server-side Blazor) or wwwroot/index.html (client-side WebAssembly Blazor) and include a theme CSS file by adding this snippet <link rel="stylesheet" href="\_content/Smart.Blazor/source/smart.default.css"> You can include 14+ additional CSS themes for the Controls.

### Source files

Open the \_Host.cshtml file (server-side Blazor) or wwwroot/index.html (client-side WebAssembly Blazor) and include this snippet

<script src="\_content/Smart.Blazor/smart.blazor.js"></script>
<script src="\_content/Smart.Blazor/smart.elements.js"></script>
			
###   

### Registrations

####   

#### Blazor WebAssembly

This step is mandatory for Blazor WebAssembly(client-side) and also for ASP.NET Core hosted project types. You should place the code into the Program.cs of your client project

```
// other usings
using Smart.Blazor;

public class Program
{
	public static async Task Main( string\[\] args )
	{
		var builder = WebAssemblyHostBuilder.CreateDefault( args );

		builder.Services
		.AddSmart()
		.AddBootstrapProviders()
		.AddFontAwesomeIcons();

		builder.Services.AddSingleton( new HttpClient
		{
			BaseAddress = new Uri( builder.HostEnvironment.BaseAddress )
		} );

		builder.RootComponents.Add<App>( "app" );

		var host = builder.Build();

		host.Services
		.UseBootstrapProviders()
		.UseFontAwesomeIcons();

		await host.RunAsync();
	}
}
```				
####   

#### Blazor Server

This step is going only into the Startup.cs of your Blazor Server project.
```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Smart.Blazor;

namespace Smart.Blazor.Demos
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddRazorPages();
			services.AddServerSideBlazor();
			services.AddSingleton<WeatherForecastService>();
			services.AddSingleton<RandomDataService>();

			// Set your license key here.
			Smart.Blazor.License.Key = "Your License Key";
			services.AddSmart();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();

			app.UseRouting();

			app.UseEndpoints(endpoints =>
				{
					endpoints.MapBlazorHub();
					endpoints.MapFallbackToPage("/\_Host");
				});
			}
		}
}
```								
###   

### Using Smart.Blazor Components
 
Use any Smart Blazor component by typing its tag name in a Blazor page e.g. <Button>Click Me</Button> If you are using client-side WebAssembly Blazor also add the following code to your .csproj file (after the closing RazorLangVersion element): <BlazorLinkOnBuild>false</BlazorLinkOnBuild>

###   

### Data binding a property
```		
<Input Value="@text"></Input>
@code {
	string text = " Hi from Smart!";
}

```		
### Events Handing
```
<Calendar id="calendar" OnChange=@OnChange></Calendar>
<div class="options">
	<div class="caption">Events</div>
	<div class="option" id="log">
	@eventLog
	</div>
</div>

@code {
	private string eventLog;

	private void OnChange(Event eventObj)
	{
		CalendarChangeEventDetail detail = eventObj\[" Detail & quot;\];

		eventLog = detail.Value\[0\].ToString();
	}
}
```
Alternatively you can do that:
```
@page "/calendar"

<Calendar OnReady="OnReady" id="calendar" ></Calendar>
<div class="options">
	<div class="caption">Events</div>
	<div class="option" id="log">
	@eventLog
	</div>
</div>


@code {
	private string eventLog;

	private void OnReady(Calendar calendar)
	{
		calendar.Changed += delegate (object sender, CalendarChangedEventArgs args)
		{
			string value = args.Value\[0\].ToString();
			eventLog = value;
			StateHasChanged();
		};
	}
}
```

`OnReady` callback is called for each Blazor component, after it is initialized and rendered.
