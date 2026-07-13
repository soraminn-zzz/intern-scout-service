require "test_helper"

class Api::V1::InternsControllerTest < ActionDispatch::IntegrationTest
  test "company can list interns" do
    company = User.create!(
      name: "List Company",
      email: "list-company@example.com",
      password: "password123",
      password_confirmation: "password123",
      role: :company
    )
    intern = User.create!(
      name: "List Intern",
      email: "list-intern@example.com",
      password: "password123",
      password_confirmation: "password123",
      role: :intern
    )
    intern.create_intern_profile!(
      school_name: "Test University",
      skills: "Ruby, TypeScript",
      desired_position: "Full-stack engineer"
    )
    token = company.issue_auth_token

    get api_v1_interns_url, headers: { "Authorization" => "Bearer #{token}" }

    assert_response :ok
    assert_equal 1, response.parsed_body["interns"].length
    assert_equal intern.id, response.parsed_body.dig("interns", 0, "id")
    assert_equal "Ruby, TypeScript", response.parsed_body.dig("interns", 0, "profile", "skills")
  end

  test "intern cannot list interns" do
    intern = User.create!(
      name: "Blocked Intern",
      email: "blocked-intern@example.com",
      password: "password123",
      password_confirmation: "password123",
      role: :intern
    )
    token = intern.issue_auth_token

    get api_v1_interns_url, headers: { "Authorization" => "Bearer #{token}" }

    assert_response :forbidden
  end
end
