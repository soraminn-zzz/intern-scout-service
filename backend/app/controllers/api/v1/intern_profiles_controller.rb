module Api
  module V1
    class InternProfilesController < ApplicationController
      before_action :authenticate_user!
      before_action :require_intern!

      def show
        render json: { intern_profile: profile_json(current_user.intern_profile) }, status: :ok
      end

      def update
        profile = current_user.intern_profile || current_user.build_intern_profile

        if profile.update(intern_profile_params)
          render json: { intern_profile: profile_json(profile) }, status: :ok
        else
          render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def require_intern!
        render json: { errors: [ "インターン生のみ利用できます" ] }, status: :forbidden unless current_user.intern?
      end

      def intern_profile_params
        params.require(:intern_profile).permit(:school_name, :graduation_year, :bio, :skills, :desired_position)
      end

      def profile_json(profile)
        return nil unless profile

        {
          id: profile.id,
          school_name: profile.school_name,
          graduation_year: profile.graduation_year,
          bio: profile.bio,
          skills: profile.skills,
          desired_position: profile.desired_position
        }
      end
    end
  end
end
