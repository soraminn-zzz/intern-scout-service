class JobPost < ApplicationRecord
  belongs_to :company, class_name: "User"

  validates :title, presence: true
  validates :description, presence: true
  validates :company, presence: true
end
