require "test_helper"

class Api::V1::FavoriteInternsControllerTest < ActionDispatch::IntegrationTest
  test "company can favorite and unfavorite intern" do
    company = create_user(role: :company, email: "favorite-company@example.com")
    intern = create_user(role: :intern, email: "favorite-intern@example.com")
    token = company.issue_auth_token

    assert_difference("FavoriteIntern.count", 1) do
      post api_v1_favorite_interns_url,
        params: { intern_id: intern.id },
        headers: { "Authorization" => "Bearer #{token}" },
        as: :json
    end

    assert_response :created
    assert_equal true, response.parsed_body.dig("intern", "is_favorited")

    assert_difference("FavoriteIntern.count", -1) do
      delete api_v1_favorite_intern_url(intern),
        headers: { "Authorization" => "Bearer #{token}" }
    end

    assert_response :no_content
  end

  test "intern cannot favorite intern" do
    intern = create_user(role: :intern, email: "favorite-blocked@example.com")
    token = intern.issue_auth_token

    post api_v1_favorite_interns_url,
      params: { intern_id: intern.id },
      headers: { "Authorization" => "Bearer #{token}" },
      as: :json

    assert_response :forbidden
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
