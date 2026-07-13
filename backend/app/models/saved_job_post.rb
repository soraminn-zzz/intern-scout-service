class SavedJobPost < ApplicationRecord
  belongs_to :intern, class_name: "User"
  belongs_to :job_post

  validates :job_post_id, uniqueness: { scope: :intern_id }
  validate :intern_must_be_intern

  private

  def intern_must_be_intern
    errors.add(:intern, "must be an intern") unless intern&.intern?
  end
end
