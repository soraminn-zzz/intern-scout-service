module Api
  module V1
    class FavoriteInternsController < ApplicationController
      before_action :authenticate_user!
      before_action :require_company!

      def index
        interns = current_user.favorited_interns.includes(:intern_profile).order(:id)

        render json: { interns: interns.map { |intern| intern_json(intern) } }, status: :ok
      end

      def create
        intern = User.intern.find(params.require(:intern_id))
        favorite = current_user.favorite_interns.find_or_initialize_by(intern: intern)

        if favorite.save
          render json: { intern: intern_json(intern) }, status: :created
        else
          render json: { errors: favorite.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        current_user.favorite_interns.find_by!(intern_id: params[:id]).destroy!

        head :no_content
      end

      private

      def require_company!
        render json: { errors: [ "Only companies can favorite interns" ] }, status: :forbidden unless current_user.company?
      end

      def intern_json(intern)
        profile = intern.intern_profile

        {
          id: intern.id,
          name: intern.name,
          email: intern.email,
          is_favorited: true,
          profile: profile && {
            school_name: profile.school_name,
            graduation_year: profile.graduation_year,
            bio: profile.bio,
            skills: profile.skills,
            desired_position: profile.desired_position
          }
        }
      end
    end
  end
end
