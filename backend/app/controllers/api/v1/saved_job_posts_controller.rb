module Api
  module V1
    class SavedJobPostsController < ApplicationController
      before_action :authenticate_user!
      before_action :require_intern!

      def index
        posts = current_user.saved_jobs.includes(:company).order(created_at: :desc)

        render json: { job_posts: posts.map { |post| job_post_json(post) } }, status: :ok
      end

      def create
        post = JobPost.where(is_active: true).find(params.require(:job_post_id))
        saved = current_user.saved_job_posts.find_or_initialize_by(job_post: post)

        if saved.save
          render json: { job_post: job_post_json(post) }, status: :created
        else
          render json: { errors: saved.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        current_user.saved_job_posts.find_by!(job_post_id: params[:id]).destroy!

        head :no_content
      end

      private

      def require_intern!
        render json: { errors: [ "Only interns can save job posts" ] }, status: :forbidden unless current_user.intern?
      end

      def job_post_json(post)
        {
          id: post.id,
          title: post.title,
          description: post.description,
          required_skills: post.required_skills,
          location: post.location,
          is_active: post.is_active,
          is_saved: true,
          created_at: post.created_at,
          company: {
            id: post.company.id,
            name: post.company.name,
            email: post.company.email
          }
        }
      end
    end
  end
end
