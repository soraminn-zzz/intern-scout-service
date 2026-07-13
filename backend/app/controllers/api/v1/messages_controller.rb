module Api
  module V1
    class MessagesController < ApplicationController
      before_action :authenticate_user!
      before_action :require_company!, only: :create

      def index
        messages = Message
          .where("sender_id = :user_id OR receiver_id = :user_id", user_id: current_user.id)
          .includes(:sender, :receiver)
          .order(created_at: :desc)

        render json: { messages: messages.map { |message| message_json(message) } }, status: :ok
      end

      def show
        message = Message
          .where("sender_id = :user_id OR receiver_id = :user_id", user_id: current_user.id)
          .includes(:sender, :receiver)
          .find(params[:id])

        mark_as_read!(message)

        render json: { message: message_json(message) }, status: :ok
      end

      def create
        receiver = User.intern.find(message_params[:receiver_id])
        message = current_user.sent_messages.build(receiver: receiver, body: message_params[:body])

        if message.save
          render json: { message: message_json(message) }, status: :created
        else
          render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def require_company!
        render json: { errors: [ "Only companies can send messages" ] }, status: :forbidden unless current_user.company?
      end

      def message_params
        params.require(:message).permit(:receiver_id, :body)
      end

      def mark_as_read!(message)
        return unless message.receiver_id == current_user.id
        return if message.read_at.present?

        message.update!(read_at: Time.current)
      end

      def message_json(message)
        {
          id: message.id,
          body: message.body,
          read_at: message.read_at,
          created_at: message.created_at,
          sender: user_json(message.sender),
          receiver: user_json(message.receiver)
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
