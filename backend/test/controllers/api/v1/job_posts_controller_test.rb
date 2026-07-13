require "test_helper"

class Api::V1::JobPostsControllerTest < ActionDispatch::IntegrationTest
  test "company can create job post" do
    company = create_user(role: :company, email: "job-company@example.com")
    token = company.issue_auth_token

    assert_difference("JobPost.count", 1) do
      post api_v1_job_posts_url, params: {
        job_post: {
          title: "Rails Intern",
          description: "Build APIs with Rails.",
          required_skills: "Ruby, Rails",
          location: "Tokyo"
        }
      }, headers: { "Authorization" => "Bearer #{token}" }, as: :json
    end

    assert_response :created
    assert_equal "Rails Intern", response.parsed_body.dig("job_post", "title")
    assert_equal company.id, response.parsed_body.dig("job_post", "company", "id")
  end

  test "intern cannot create job post" do
    intern = create_user(role: :intern, email: "job-intern@example.com")
    token = intern.issue_auth_token

    post api_v1_job_posts_url, params: {
      job_post: {
        title: "Rails Intern",
        description: "Build APIs with Rails."
      }
    }, headers: { "Authorization" => "Bearer #{token}" }, as: :json

    assert_response :forbidden
  end

  test "user can list active job posts" do
    company = create_user(role: :company, email: "job-list-company@example.com")
    company.job_posts.create!(
      title: "Frontend Intern",
      description: "Build UI with Next.js.",
      required_skills: "TypeScript",
      location: "Remote"
    )
    company.job_posts.create!(
      title: "Inactive Intern",
      description: "Hidden",
      is_active: false
    )
    intern = create_user(role: :intern, email: "job-list-intern@example.com")
    token = intern.issue_auth_token

    get api_v1_job_posts_url, headers: { "Authorization" => "Bearer #{token}" }

    assert_response :ok
    assert_equal 1, response.parsed_body["job_posts"].length
    assert_equal "Frontend Intern", response.parsed_body.dig("job_posts", 0, "title")
  end

  test "user can filter job posts by keyword location and skill" do
    company = create_user(role: :company, email: "job-search-company@example.com")
    company.job_posts.create!(
      title: "Rails API Intern",
      description: "Build backend APIs.",
      required_skills: "Ruby, Rails",
      location: "Tokyo"
    )
    company.job_posts.create!(
      title: "Design Intern",
      description: "Improve UI.",
      required_skills: "Figma",
      location: "Osaka"
    )
    intern = create_user(role: :intern, email: "job-search-intern@example.com")
    token = intern.issue_auth_token

    get api_v1_job_posts_url(keyword: "api", location: "tokyo", skill: "rails"),
      headers: { "Authorization" => "Bearer #{token}" }

    assert_response :ok
    assert_equal 1, response.parsed_body["job_posts"].length
    assert_equal "Rails API Intern", response.parsed_body.dig("job_posts", 0, "title")
  end

  private

  def create_user(role:, email:)
    User.create!(
      name: email.split("@").first,
      email: email,
      password: "password123",
      password_confirmation: "password123",
      role: role
    )
  end
end
