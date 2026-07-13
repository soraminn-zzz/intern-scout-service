class CreateSavedJobPosts < ActiveRecord::Migration[8.1]
  def change
    create_table :saved_job_posts do |t|
      t.references :intern, null: false, foreign_key: { to_table: :users }
      t.references :job_post, null: false, foreign_key: true

      t.timestamps
    end

    add_index :saved_job_posts, %i[intern_id job_post_id], unique: true
  end
end
