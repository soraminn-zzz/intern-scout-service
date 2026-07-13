require "test_helper"

class Api::V1::SavedJobPostsControllerTest < ActionDispatch::IntegrationTest
  test "intern can save and unsave job post" do
    company = create_user(role: :company, email: "save-job-company@example.com")
    intern = create_user(role: :intern, email: "save-job-intern@example.com")
    post = company.job_posts.create!(
      title: "Saved Job",
      description: "A job to save."
    )
    token = intern.issue_auth_token

    assert_difference("SavedJobPost.count", 1) do
      post api_v1_saved_job_posts_url,
        params: { job_post_id: post.id },
        headers: { "Authorization" => "Bearer #{token}" },
        as: :json
    end

    assert_response :created
    assert_equal true, response.parsed_body.dig("job_post", "is_saved")

    assert_difference("SavedJobPost.count", -1) do
      delete api_v1_saved_job_post_url(post),
        headers: { "Authorization" => "Bearer #{token}" }
    end

    assert_response :no_content
  end

  test "company cannot save job post" do
    company = create_user(role: :company, email: "save-blocked-company@example.com")
    post = company.job_posts.create!(
      title: "Company Job",
      description: "Company cannot save."
    )
    token = company.issue_auth_token

    post api_v1_saved_job_posts_url,
      params: { job_post_id: post.id },
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
