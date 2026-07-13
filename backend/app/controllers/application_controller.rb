class ApplicationController < ActionController::API
  attr_reader :current_user

  private

  def authenticate_user!
    token = request.authorization.to_s.delete_prefix("Bearer ").presence
    @current_user = User.find_each.find { |user| user.authenticated_by_token?(token) } if token

    render json: { errors: [ "ログインが必要です" ] }, status: :unauthorized unless current_user
  end
end
