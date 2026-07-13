require "test_helper"

class Api::V1::AuthControllerTest < ActionDispatch::IntegrationTest
  test "register creates a user and returns token" do
    assert_difference("User.count", 1) do
      post api_v1_register_url, params: {
        user: {
          name: "Test Intern",
          email: "test-intern@example.com",
          password: "password123",
          password_confirmation: "password123",
          role: "intern"
        }
      }, as: :json
    end

    assert_response :created
    body = response.parsed_body
    assert body["token"].present?
    assert_equal "test-intern@example.com", body.dig("user", "email")
    assert_equal "intern", body.dig("user", "role")
  end

  test "login returns token with valid credentials" do
    User.create!(
      name: "Test Company",
      email: "test-company@example.com",
      password: "password123",
      password_confirmation: "password123",
      role: :company
    )

    post api_v1_login_url, params: {
      user: {
        email: "test-company@example.com",
        password: "password123"
      }
    }, as: :json

    assert_response :ok
    assert response.parsed_body["token"].present?
    assert_equal "company", response.parsed_body.dig("user", "role")
  end

  test "me returns current user with bearer token" do
    user = User.create!(
      name: "Current User",
      email: "current-user@example.com",
      password: "password123",
      password_confirmation: "password123",
      role: :intern
    )
    token = user.issue_auth_token

    get api_v1_me_url, headers: { "Authorization" => "Bearer #{token}" }

    assert_response :ok
    assert_equal user.id, response.parsed_body.dig("user", "id")
  end
end
