require "test_helper"

class Api::V1::MessagesControllerTest < ActionDispatch::IntegrationTest
  test "company can send message to intern" do
    company = create_user(role: :company, email: "message-company@example.com")
    intern = create_user(role: :intern, email: "message-intern@example.com")
    token = company.issue_auth_token

    assert_difference("Message.count", 1) do
      post api_v1_messages_url, params: {
        message: {
          receiver_id: intern.id,
          body: "Please join our internship."
        }
      }, headers: { "Authorization" => "Bearer #{token}" }, as: :json
    end

    assert_response :created
    assert_equal company.id, response.parsed_body.dig("message", "sender", "id")
    assert_equal intern.id, response.parsed_body.dig("message", "receiver", "id")
  end

  test "intern cannot send message" do
    intern = create_user(role: :intern, email: "sender-intern@example.com")
    receiver = create_user(role: :intern, email: "receiver-intern@example.com")
    token = intern.issue_auth_token

    post api_v1_messages_url, params: {
      message: {
        receiver_id: receiver.id,
        body: "Hello"
      }
    }, headers: { "Authorization" => "Bearer #{token}" }, as: :json

    assert_response :forbidden
  end

  test "user can list own sent and received messages" do
    company = create_user(role: :company, email: "list-message-company@example.com")
    intern = create_user(role: :intern, email: "list-message-intern@example.com")
    other_company = create_user(role: :company, email: "other-message-company@example.com")
    company.sent_messages.create!(receiver: intern, body: "Visible message")
    other_company.sent_messages.create!(receiver: create_user(role: :intern, email: "other-intern@example.com"), body: "Hidden message")
    token = intern.issue_auth_token

    get api_v1_messages_url, headers: { "Authorization" => "Bearer #{token}" }

    assert_response :ok
    assert_equal 1, response.parsed_body["messages"].length
    assert_equal "Visible message", response.parsed_body.dig("messages", 0, "body")
  end

  test "receiver reads message and read_at is set" do
    company = create_user(role: :company, email: "read-company@example.com")
    intern = create_user(role: :intern, email: "read-intern@example.com")
    message = company.sent_messages.create!(receiver: intern, body: "Read this")
    token = intern.issue_auth_token

    get api_v1_message_url(message), headers: { "Authorization" => "Bearer #{token}" }

    assert_response :ok
    assert response.parsed_body.dig("message", "read_at").present?
    assert message.reload.read_at.present?
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
