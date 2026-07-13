module Api
  module V1
    class JobPostsController < ApplicationController
      before_action :authenticate_user!
      before_action :require_company!, only: %i[create update]

      def index
        posts = filtered_posts.includes(:company).order(created_at: :desc)

        render json: { job_posts: posts.map { |post| job_post_json(post) } }, status: :ok
      end

      def show
        post = JobPost.includes(:company).find(params[:id])

        render json: { job_post: job_post_json(post) }, status: :ok
      end

      def create
        post = current_user.job_posts.build(job_post_params)

        if post.save
          render json: { job_post: job_post_json(post) }, status: :created
        else
          render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        post = current_user.job_posts.find(params[:id])

        if post.update(job_post_params)
          render json: { job_post: job_post_json(post) }, status: :ok
        else
          render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def require_company!
        render json: { errors: [ "Only companies can manage job posts" ] }, status: :forbidden unless current_user.company?
      end

      def job_post_params
        params.require(:job_post).permit(:title, :description, :required_skills, :location, :is_active)
      end

      def filtered_posts
        posts = JobPost.where(is_active: true)

        if params[:keyword].present?
          keyword = "%#{ActiveRecord::Base.sanitize_sql_like(params[:keyword].to_s.downcase)}%"
          posts = posts.where(
            "lower(title) LIKE :keyword OR lower(description) LIKE :keyword",
            keyword: keyword
          )
        end

        if params[:location].present?
          location = "%#{ActiveRecord::Base.sanitize_sql_like(params[:location].to_s.downcase)}%"
          posts = posts.where("lower(location) LIKE ?", location)
        end

        if params[:skill].present?
          skill = "%#{ActiveRecord::Base.sanitize_sql_like(params[:skill].to_s.downcase)}%"
          posts = posts.where("lower(required_skills) LIKE ?", skill)
        end

        posts
      end

      def job_post_json(post)
        {
          id: post.id,
          title: post.title,
          description: post.description,
          required_skills: post.required_skills,
          location: post.location,
          is_active: post.is_active,
          is_saved: current_user.intern? && current_user.saved_job_posts.exists?(job_post_id: post.id),
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
