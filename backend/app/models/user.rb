class User < ApplicationRecord
  has_secure_password

  enum :role, { intern: 0, company: 1 }

  has_one :intern_profile, dependent: :destroy
  has_one :company_profile, dependent: :destroy
  has_many :sent_messages, class_name: "Message", foreign_key: :sender_id, dependent: :destroy
  has_many :received_messages, class_name: "Message", foreign_key: :receiver_id, dependent: :destroy
  has_many :job_posts, foreign_key: :company_id, dependent: :destroy
  has_many :favorite_interns, foreign_key: :company_id, dependent: :destroy
  has_many :favorited_interns, through: :favorite_interns, source: :intern
  has_many :saved_job_posts, foreign_key: :intern_id, dependent: :destroy
  has_many :saved_jobs, through: :saved_job_posts, source: :job_post

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :role, presence: true

  normalizes :email, with: ->(email) { email.strip.downcase }

  def issue_auth_token
    token = SecureRandom.urlsafe_base64(32)
    update!(auth_token_digest: BCrypt::Password.create(token))
    token
  end

  def authenticated_by_token?(token)
    return false if auth_token_digest.blank?

    BCrypt::Password.new(auth_token_digest).is_password?(token)
  end
end
