require "test_helper"

class Api::V1::InternProfilesControllerTest < ActionDispatch::IntegrationTest
  test "intern can create own profile" do
    intern = User.create!(
      name: "Profile Intern",
      email: "profile-intern@example.com",
      password: "password123",
      password_confirmation: "password123",
      role: :intern
    )
    token = intern.issue_auth_token

    patch api_v1_intern_profile_url, params: {
      intern_profile: {
        school_name: "Test University",
        graduation_year: 2027,
        bio: "Backend developer",
        skills: "Ruby, Rails",
        desired_position: "Web engineer"
      }
    }, headers: { "Authorization" => "Bearer #{token}" }, as: :json

    assert_response :ok
    assert_equal "Test University", response.parsed_body.dig("intern_profile", "school_name")
    assert_equal "Ruby, Rails", response.parsed_body.dig("intern_profile", "skills")
  end

  test "company cannot update intern profile" do
    company = User.create!(
      name: "Profile Company",
      email: "profile-company@example.com",
      password: "password123",
      password_confirmation: "password123",
      role: :company
    )
    token = company.issue_auth_token

    patch api_v1_intern_profile_url, params: {
      intern_profile: { school_name: "Test University" }
    }, headers: { "Authorization" => "Bearer #{token}" }, as: :json

    assert_response :forbidden
  end
end
