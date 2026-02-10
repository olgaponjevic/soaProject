FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /Users

COPY Users/Users.csproj Users/
RUN dotnet restore Users/Users.csproj

COPY . .
RUN dotnet publish Users/Users.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
COPY --from=build /app/publish ./
EXPOSE 8080
ENTRYPOINT ["dotnet", "Users.dll"]