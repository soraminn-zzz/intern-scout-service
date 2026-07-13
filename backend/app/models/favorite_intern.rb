class FavoriteIntern < ApplicationRecord
  belongs_to :company, class_name: "User"
  belongs_to :intern, class_name: "User"

  validates :intern_id, uniqueness: { scope: :company_id }
  validate :company_must_be_company
  validate :intern_must_be_intern

  private

  def company_must_be_company
    errors.add(:company, "must be a company") unless company&.company?
  end

  def intern_must_be_intern
    errors.add(:intern, "must be an intern") unless intern&.intern?
  end
end
