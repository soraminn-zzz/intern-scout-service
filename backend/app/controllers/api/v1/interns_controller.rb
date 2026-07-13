module Api
  module V1
    class InternsController < ApplicationController
      before_action :authenticate_user!
      before_action :require_company!

      def index
        interns = User.intern.includes(:intern_profile).order(:id)

        render json: { interns: interns.map { |intern| intern_json(intern) } }, status: :ok
      end

      def show
        intern = User.intern.includes(:intern_profile).find(params[:id])

        render json: { intern: intern_json(intern) }, status: :ok
      end

      private

      def require_company!
        render json: { errors: [ "企業のみ利用できます" ] }, status: :forbidden unless current_user.company?
      end

      def intern_json(intern)
        profile = intern.intern_profile

        {
          id: intern.id,
          name: intern.name,
          email: intern.email,
          is_favorited: current_user.favorite_interns.exists?(intern_id: intern.id),
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
