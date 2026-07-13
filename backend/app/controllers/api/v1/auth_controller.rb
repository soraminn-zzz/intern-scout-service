module Api
  module V1
    class AuthController < ApplicationController
      before_action :authenticate_user!, only: :me

      def register
        user = User.new(user_params)

        if user.save
          token = user.issue_auth_token
          render json: auth_response(user, token), status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: login_params[:email].to_s.strip.downcase)

        if user&.authenticate(login_params[:password])
          token = user.issue_auth_token
          render json: auth_response(user, token), status: :ok
        else
          render json: { errors: [ "メールアドレスまたはパスワードが正しくありません" ] }, status: :unauthorized
        end
      end

      def me
        render json: { user: user_json(current_user) }, status: :ok
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :role)
      end

      def login_params
        params.require(:user).permit(:email, :password)
      end

      def auth_response(user, token)
        {
          token: token,
          user: user_json(user)
        }
      end

      def user_json(user)
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      end
    end
  end
end
