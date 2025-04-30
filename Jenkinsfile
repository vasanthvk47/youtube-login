pipeline {
    agent any

    environment {
        IMAGE_NAME = "vasanth4747/student-college-login-animation"
        TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/vasanthvk47/student-college-animation.git'
            }
        }

        stage('Verify Minikube Environment Before Build') {
            steps {
                script {
                    sh "kubectl version --client"
                    sh "kubectl config current-context"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t $IMAGE_NAME:$TAG ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-password', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    script {
                        sh '''
                            echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
                            docker push "$IMAGE_NAME:$TAG"
                        '''
                    }
                }
            }
        }

        stage('Verify Minikube Environment After Build') {
            steps {
                script {
                    sh "kubectl version --client"
                    sh "kubectl config current-context"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh "kubectl apply -f k8s/deployment.yaml --validate=false --insecure-skip-tls-verify=true"
                    sh "kubectl apply -f k8s/service.yaml --validate=false --insecure-skip-tls-verify=true"
                }
            }
        }
    }
}
